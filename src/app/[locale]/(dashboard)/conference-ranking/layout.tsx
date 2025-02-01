import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conference Ranking",
    description: "Conference Ranking",
}

export default function ConferenceRankingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            {children}
        </div>
    )
} 