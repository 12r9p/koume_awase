import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'カルタゲーム - プレイ中',
  description: 'カルタゲームをプレイ中',
}

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
