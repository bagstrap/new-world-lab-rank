

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <main className="bg-white rounded-lg shadow-sm">
                    {children}
                </main>
            </div>
        </div>
    )
} 