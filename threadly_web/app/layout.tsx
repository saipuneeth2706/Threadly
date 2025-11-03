import React from 'react'

type Props = {
	children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
	return (
		<html lang="en">
			<head />
			<body style={{margin: 0, fontFamily: 'Inter, UI-sans-serif, system-ui, -apple-system', background: '#121212', color: '#e6e6e6'}}>
				<div style={{height: '100vh', display: 'flex', gap: 16, padding: 20}}>
					{/* leftmost narrow toolbar */}
					<div style={{width: 64, background: '#0f0f0f', borderRadius: 16, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
						{[...Array(6)].map((_, i) => (
							<div key={i} style={{width: 44, height: 44, borderRadius: 10, background: '#141414', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)'}} />
						))}
					</div>

					{/* the main content area */}
					{children}
				</div>
			</body>
		</html>
	)
}

