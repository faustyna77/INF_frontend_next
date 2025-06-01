export default function ClientInfo({ client }) {
    return (
        <div className="border rounded-lg text-center p-4 shadow-md">
            <h2 className="text-lg font-bold">{client.firstName} {client.lastName}</h2>
            <p className="text-sm text-gray-600">📞 {client.phone}</p>
        </div>
    );
}
