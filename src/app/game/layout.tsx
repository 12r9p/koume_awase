import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'コウメ合わせ - プレイ中',
  description: 'コウメ合わせをプレイ中',
}

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
