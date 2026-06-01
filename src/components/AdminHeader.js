import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">
        Admin<span className="text-blue-600">Panel</span>
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Welcome, Admin</span>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          Lihat Website →
        </Link>
      </div>
    </header>
  );
}
