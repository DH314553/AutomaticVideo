import type { MetaFunction } from '@remix-run/node';
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react';

export const meta: MetaFunction = () => ([
  { charset: 'utf-8' },
	{ title: 'Remix remotion'},
  { name: 'description', content: 'Your page description goes here.' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  { 'http-equiv': 'X-UA-Compatible', content: 'IE=Chrome' },
  // 他のメタデータも必要に応じて追加
]);



export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
