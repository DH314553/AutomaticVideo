# -*- coding: utf-8 -*-
import subprocess
from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout, QTextEdit, QSlider, QPushButton, QFileDialog, QLineEdit
from PySide6.QtCore import Qt, QObject, QThread, Signal
import cv2
import boto3
import json
import requests
from moviepy.editor import VideoFileClip
from pyChatGPT import ChatGPT

class GptPrompt:
    def __init__(self):
        self.session_token = ""
        self.email = ""
        self.password = ""
        self.chatgpt = None

    def set_credentials(self, session_token, email, password):
        self.session_token = session_token
        self.email = email
        self.password = password
        self.chatgpt = ChatGPT(email=self.email, password=self.password, session_token=self.session_token)

    def send_message_to_bot(self, user_message):
        if self.chatgpt:
            # ユーザーのメッセージを送信し、ボットからの返答を取得
            bot_message = self.chatgpt.send_message(user_message)
            return bot_message
        else:
            return "ログインしていません。"

class Worker(QObject):
    finished = Signal()

    def __init__(self, editor):
        super().__init__()
        self.editor = editor

    def run_build(self):
        self.editor = editor
        if self.editor.gpt_prompt.chatgpt:
            subprocess.run(["npm", "run", "build"], env={"SCRIPT_TEXT": self.editor.textArea.toPlainText()})
        self.finished.emit()

class VideoEditor(QWidget):
    def __init__(self):
        super().__init__()
        self.gpt_prompt = GptPrompt()  # GptPromptのインスタンスを作成
        layout = QVBoxLayout()
        self.sessionTokenInput = QLineEdit()
        self.sessionTokenInput.setPlaceholderText("セッショントークンを入力してください")
        layout.addWidget(self.sessionTokenInput)
        self.emailInput = QLineEdit()
        self.emailInput.setPlaceholderText("メールアドレスを入力してください")
        layout.addWidget(self.emailInput)
        self.passwordInput = QLineEdit()
        self.passwordInput.setPlaceholderText("パスワードを入力してください")
        layout.addWidget(self.passwordInput)
        loginButton = QPushButton("ログイン")
        loginButton.clicked.connect(self.login)
        layout.addWidget(loginButton)
        self.textArea = QTextEdit()
        layout.addWidget(self.textArea)
        # メッセージ送信ボタンを追加
        textButton = QPushButton("メッセージ送信")
        textButton.clicked.connect(self.update_prompt_text)
        layout.addWidget(textButton)
        replaceButton = QPushButton("プロンプトテキスト反映")
        replaceButton.clicked.connect(self.update_prompt_text)
        layout.addWidget(replaceButton)
        self.timeline = QSlider(Qt.Horizontal)
        layout.addWidget(self.timeline)
        previewButton = QPushButton("プレビュー")
        previewButton.clicked.connect(self.preview)
        layout.addWidget(previewButton)
        importButton = QPushButton("動画インポート")
        importButton.clicked.connect(self.import_file)
        layout.addWidget(importButton)
        exportButton = QPushButton("エクスポート")
        exportButton.clicked.connect(self.export_file)
        layout.addWidget(exportButton)
        self.setLayout(layout)
        # Lambda関数呼び出しボタンを追加
        lambdaButton = QPushButton("Lambda関数呼び出し")
        lambdaButton.clicked.connect(self.call_lambda)
        layout.addWidget(lambdaButton)
        self.video_clip = None
        self.thread = None  # スレッドを初期化

    def login(self):
        session_token = self.sessionTokenInput.text()
        email = self.emailInput.text()
        password = self.passwordInput.text()
        self.gpt_prompt.set_credentials(session_token, email, password)

        # スレッドを開始
        self.thread = QThread()
        self.worker = Worker(self)
        self.worker.moveToThread(self.thread)
        self.thread.started.connect(self.worker.run_build)
        self.worker.finished.connect(self.thread.quit)
        self.thread.finished.connect(self.update_prompt_text)  # タスク完了時にプロンプトテキストを更新
        self.thread.start()

    def update_prompt_text(self):
        # ボットからの返答を表示
        user_message = self.textArea.toPlainText()
        response_dict = self.gpt_prompt.send_message_to_bot(user_message)
        bot_message = response_dict.get("message")  # Unicodeエスケープ文字列をデコード
        self.textArea.setPlainText(bot_message)

    def preview(self):
        if self.video_clip:
            for frame in self.video_clip.iter_frames(fps=24, dtype='uint8'):
                cv2.imshow("Preview", cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
            cv2.destroyAllWindows()

    def import_file(self):
        file_name, _ = QFileDialog.getOpenFileName(self, "動画ファイルを開く")
        if file_name:
            self.video_clip = VideoFileClip(file_name)
            self.timeline.setRange(0, int(self.video_clip.duration))
            print(f"動画をインポート: {file_name}")

    def export_file(self):
        if self.video_clip:
            file_name, _ = QFileDialog.getSaveFileName(self, "動画を保存")
            if file_name:
                self.video_clip.write_videofile(file_name)
                print(f"動画をエクスポート: {file_name}")

    def call_lambda(self):
        client = boto3.client("lambda")

        # aws.jsonから設定を読み込む
        with open("/aws.json", "r") as f:
            lambda_input = json.load(f)

        # エンドポイントのURL
        endpoint_url = "https://l699txm0q4.execute-api.us-east-1.amazonaws.com/default/remotion-render-3-3-103-mem2048mb-disk2048mb-120sec"
    
        try:
            # AWS Lambda関数を呼び出す
            lambda_response = client.invoke(
                FunctionName='remotion-render-3-3-103-mem2048mb-disk2048mb-120sec',
                InvocationType='RequestResponse',
                Payload=json.dumps(lambda_input).encode()
            )
            lambda_payload = json.loads(lambda_response['Payload'].read().decode())
            print("Lambda response:", lambda_payload)
    
            # REST API エンドポイントを呼び出す
            api_response = requests.post(endpoint_url, json=lambda_payload)
            if api_response.status_code == 200:
                print("Endpoint response:", api_response.json())
            else:
                print(f"Endpoint returned status code {api_response.status_code}: {api_response.text}")
    
        except Exception as e:
            print(f"Error calling Lambda function or Endpoint: {e}")


if __name__ == "__main__":
    app = QApplication([])
    editor = VideoEditor()
    editor.show()
    app.exec_()


