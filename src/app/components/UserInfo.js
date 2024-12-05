export  default function UserInfo(
    firstname,
    lastname,
    email
){
    return (
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-purple-700 mb-6">
          Bienvenido (a) {firstname} {lastname}
        </h1>
        <div className="text-gray-700 mb-6">
          <p>
            <strong className="font-medium text-gray-900">Correo electrónico:</strong> {email}
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="py-2 px-6 text-sm font-medium text-white bg-purple-600 rounded-md shadow-md hover:bg-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    )
}