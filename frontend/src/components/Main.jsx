const Main=()=>{
    return(
    <main className="min-h-screen bg-gray-100">
        <section className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Contenido Principal</h2>
            <p className="mb-6 text-gray-700">
            Aquí inicia el contenido principal. 
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">Tarjeta 1</h3>
                <p className="text-gray-600">
                Y dentro de su cuento ella era cenicienta (Tailwind)
                </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">Tarjeta 2</h3>
                <p className="text-gray-600">
                Cuando el mundo tira para abajo, es mejor no estar atado a nada
                </p>
            </div>
            </div>
        </section>
        </main>
    )
}
export default Main