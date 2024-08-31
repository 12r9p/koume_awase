import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '高難易度コウメ合わせ - プレイ中',
  description: '高難易度コウメ合わせをプレイ中',
}

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
