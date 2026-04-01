export default function Leads() {
    async function updateLeads() {
        try {
            setLoading(true)
            await fetch('/api/get-leads')
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Leads</h1>
        </div>
    )
}
