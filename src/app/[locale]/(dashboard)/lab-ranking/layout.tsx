import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lab Ranking",
    description: "Lab Ranking",
}

export default function LabRankingLayout({
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