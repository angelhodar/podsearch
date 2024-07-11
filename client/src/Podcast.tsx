export default function Podcast() {
    return (<div className="p-6 bg-white border rounded-lg shadow-lg flex flex-col">
        <div className="flex items-start gap-4">
            <img
                src="https://img-static.ivoox.com/index.php?w=145&h=145&url=https://static-1.ivoox.com/canales/a/1/b/5/a1b596f2462abf2556a1f8ab192e6cc4_XXL.jpg"
                alt="Podcast Thumbnail"
                width={80}
                height={80}
                className="rounded-lg object-cover"
            />
            <div className="flex-1">
                <h3 className="text-lg font-medium">The Mindful Minute</h3>
                <p className="text-base text-muted-foreground">Alex Benlloch y Bruno Casanovas</p>
                <a href="https://www.nude-project.com" className="text-sm text-blue-500 hover:underline">https://www.nude-project.com</a>
            </div>
        </div>
        <div className="mt-3">
            <p className="text-sm text-muted-foreground">Todo comenzó en una habitación universitaria... Era 2018, conocí a Bruno un mes antes. Ambos teníamos 18 años, pero habíamos crecido en entornos muy diferentes. Él era de Bali, yo, Alex, de Burgos (un poco más al norte). Entonces, algo nos unió para siempre: el propósito de crear un movimiento entre los jóvenes de nuestra generación. Juntamos 300 euros cada uno y empezamos a hacer sudaderas. No solo era la ropa, sino el mensaje que queríamos transmitir. "Todo se puede lograr con pasión", pero primero teníamos que demostrarlo...</p>
        </div>
    </div>)
}