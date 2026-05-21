'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Phone, Mail, MapPin, Truck, Clock, Users, ChevronRight, CheckCircle, Facebook, Instagram } from 'lucide-react'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentClientIndex, setCurrentClientIndex] = useState(0)
  const totalClients = 9

  // Auto-play carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentClientIndex((prevIndex) => (prevIndex + 1) % totalClients)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const nextClient = () => {
    setCurrentClientIndex((prevIndex) => (prevIndex + 1) % totalClients)
  }

  const prevClient = () => {
    setCurrentClientIndex((prevIndex) => (prevIndex - 1 + totalClients) % totalClients)
  }

  const goToClient = (index: number) => {
    setCurrentClientIndex(index)
  }

  const services = [
    {
    
      title: "Transporte de Cargas Generales",
      description: "Movemos tu mercadería con seguridad y eficiencia a cualquier punto del país.",
      image: "/images/casereno2.png"
    },
    {
      title: "Carga Refrigerada",
      description: "Transporte especializado para productos que requieren cadena de frío.",
      image: "/images/casereno3.png"
    },
    {
     
      title: "Servicio Express",
      description: "Entregas urgentes con prioridad y seguimiento en tiempo real.",
      image: "/images/casereno4.png"
    },
    {
      
      title: "Logística Integral",
      description: "Soluciones completas de almacenamiento y distribución.",
      image: "/images/casereno5.png"
    }
  ]

  const features = [
    "Más de 19 años de experiencia",
    "Responsabilidad",
    "Seriedad",
    "Cobertura nacional",
    "Honestidad",
    "Atención personalizada"
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-black shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  src="/images/logo.png" 
                  alt="El Casereño Logo" 
                  className="h-10 w-auto scale-[2.05]"
                />
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#inicio" className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Inicio</a>
                <a href="#servicios" className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Servicios</a>
                <a href="#nosotros" className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Nosotros</a>
                <a href="#contacto" className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contacto</a>
              </div>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-yellow-400 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black border-t border-gray-800">
              <a href="#inicio" className="text-white hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium">Inicio</a>
              <a href="#servicios" className="text-white hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium">Servicios</a>
              <a href="#nosotros" className="text-white hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium">Nosotros</a>
              <a href="#contacto" className="text-white hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium">Contacto</a>
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors w-full mt-2">
                Cotizar ahora
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative h-screen text-white">
        <div className="absolute inset-0">
          <img 
            src="/images/Portada.png" 
            alt="Camión de carga El Casereño" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/90"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Transporte de Cargas<br />
              <span className="text-yellow-400">El Casereño</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-12 max-w-4xl mx-auto font-light">
              Conectamos tu negocio con destino seguro y puntual. Más de 15 años de experiencia en transporte nacional de cargas.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
            
              <button className="border-2 border-yellow-400 text-yellow-400 px-10 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105">
               <a href="#servicios"> Ver Servicios</a>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Soluciones integrales de transporte adaptadas a las necesidades de tu empresa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="service-card text-center">
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-yellow-400 bg-opacity-20 flex items-center justify-center">
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="nosotros" className="py-20 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Sobre El Casereño
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Nacimos en 2007 en Monte Caseros, Corrientes, como una empresa familiar con sólidas raíces en la industria supermercadista. Desde nuestros inicios, nos hemos consolidado en el sector bajo tres pilares fundamentales: seriedad, honestidad y responsabilidad.
                Hoy contamos con una infraestructura robusta de más de 55 unidades equipadas con tecnología de frío Carrier de nueva generación, lo que nos permite garantizar la máxima eficiencia, seguridad y calidad en cada uno de nuestros servicios
 
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Nuestra experiencia nos permite ofrecer soluciones logísticas integrales, conectando los principales centros productivos del país con destino garantizado.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="/images/casereno6.png" 
                alt="Equipo El Casereño" 
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-600 to-transparent opacity-80 rounded-lg"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-2">¿Por qué elegirnos?</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <ChevronRight className="w-5 h-5 mr-2 flex-shrink-0 text-yellow-400" />
                    <span className="text-sm">Experiencia Comprobada</span>
                  </div>
                  <div className="flex items-center">
                    <ChevronRight className="w-5 h-5 mr-2 flex-shrink-0 text-yellow-400" />
                    <span className="text-sm">Flota Moderna</span>
                  </div>
                  <div className="flex items-center">
                    <ChevronRight className="w-5 h-5 mr-2 flex-shrink-0 text-yellow-400" />
                    <span className="text-sm">Atención Personalizada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-right">
                Un poco de<br />
                <span className="text-yellow-500">nuestra historia</span>
              </h2>
              <div className="w-20 h-1 bg-yellow-400 mb-8 ml-auto"></div>
              
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Transporte El Casereño S.A. es una empresa relativamente joven -con 18 años de vida formal- pero con raíces que se remontan aún más atrás, a la pasión, el empuje y la visión de un hombre decidido a transformar la logística de frutas finas en nuestro país.
                </p>
                
                <p className="text-lg">
                  Nuestro fundador, el señor <strong>José Luis Gorbeña</strong>, oriundo de Monte Caseros, Corrientes, descubrió que en Concordia se cultivaban arándanos de la más alta calidad. Es una fruta delicada, que exigía un transporte extremadamente cuidadoso y veloz hasta el Aeropuerto Internacional de Ezeiza.
                </p>
                
                <p className="text-lg">
                  Con apenas tres camiones de pequeño porte, se presentó ante la firma <strong>BLUEBERRIES</strong> en la Ruta Nacional Nº 14. Allí, con coraje y profesionalismo, logró ganarse la confianza de sus directivos.
                </p>
                
                <p className="text-lg">
                  El crecimiento fue exponencial. A medida que la demanda aumentaba, asumimos el desafío de contratar fleteros de diversas provincias, decididos a no renunciar a nuestro compromiso con el cliente.
                </p>
                
                <p className="text-lg">
                  En <strong>2007</strong> nació formalmente <strong>Transporte El Casereño S.A.</strong> con el apoyo incondicional de su hijo José Luis y el esfuerzo diario de conductores y equipo administrativo.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="text-5xl font-bold text-yellow-500">2007</div>
                    <div className="text-gray-700">
                      <div className="font-semibold">Año de fundación</div>
                      <div className="text-sm">Nacimiento formal de la empresa</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="text-5xl font-bold text-yellow-500">18+</div>
                    <div className="text-gray-700">
                      <div className="font-semibold">Años de experiencia</div>
                      <div className="text-sm">Trayectoria consolidada</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="text-5xl font-bold text-yellow-500">55+</div>
                    <div className="text-gray-700">
                      <div className="font-semibold">Unidades en flota</div>
                      <div className="text-sm">Tecnología Carrier de última generación</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="text-5xl font-bold text-yellow-500">3</div>
                    <div className="text-gray-700">
                      <div className="font-semibold">Camiones iniciales</div>
                      <div className="text-sm">El inicio de nuestra historia</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Zonas de Cobertura
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conectamos todo el territorio argentino con nuestro servicio de transporte nacional
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/images/casereno1.png" 
                alt="Mapa de cobertura Argentina" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-transparent opacity-70"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <h3 className="text-3xl font-bold mb-4">Cobertura Nacional</h3>
                  <p className="text-xl">Conectando todo el país</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Norte Argentino</h3>
                <p className="text-gray-600">
                  Salta, Jujuy, Tucumán, Santiago del Estero, Catamarca, La Rioja
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Centro y Cuyo</h3>
                <p className="text-gray-600">
                  Córdoba, Santa Fe, Mendoza, San Juan, San Luis, Buenos Aires
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Patagonia</h3>
                <p className="text-gray-600">
                  Neuquén, Río Negro, Chubut, Santa Cruz, Tierra del Fuego
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Carousel Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Clientes que confían en nosotros
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Empresas líderes que eligen nuestros servicios de transporte
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-lg shadow-xl bg-gray-50" style={{ minHeight: '600px' }}>
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentClientIndex * 100}%)` }}
              >
                {Array.from({ length: totalClients }, (_, index) => (
                  <div key={index} className="w-full flex-shrink-0 flex items-center justify-center p-16" style={{ minHeight: '600px' }}>
                    <img 
                      src={`/images/clientes/${String(index + 1).padStart(2, '0')}.png`}
                      alt={`Cliente ${index + 1}`}
                      className="max-h-[500px] w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <button 
              onClick={prevClient}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-300 text-black p-3 rounded-full shadow-lg transition-colors duration-300 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextClient}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-300 text-black p-3 rounded-full shadow-lg transition-colors duration-300 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Navigation Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalClients }, (_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentClientIndex ? 'bg-yellow-400' : 'bg-gray-300 hover:bg-yellow-400'}`}
                  onClick={() => goToClient(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contacto
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ¿Listo para enviar tu carga? Comunícate con nosotros y obtén una cotización inmediata
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Empresa
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Tu empresa"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="03775 15-63-8819"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe tu necesidad de transporte..."
                  />
                </div>
                
                <button type="submit" className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors w-full">
                  Enviar Mensaje
                </button>
              </form>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="w-6 h-6 text-yellow-400 mr-4" />
                    <div>
                      <p className="font-semibold text-gray-900">Teléfono</p>
                      <p className="text-gray-600">03775 15-63-8819</p>
                      <p className="text-gray-600">03775 15-63-8819 (WhatsApp)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="w-6 h-6 text-yellow-400 mr-4" />
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-gray-600">josegorbena@grupo-jlg.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-6 h-6 text-yellow-400 mr-4" />
                    <div>
                      <p className="font-semibold text-gray-900">Dirección</p>
                      <p className="text-gray-600">av. Libertador 1280, Monte Caseros, Corrientes 3220</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Facebook className="w-6 h-6 text-yellow-400 mr-4" />
                    <div>
                      <p className="font-semibold text-gray-900">Facebook</p>
                      <a 
                        href="https://www.facebook.com/p/Transporte-El-Casere%C3%B1o-SA-100063768003262/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-yellow-400 transition-colors"
                      >
                        Transporte El Casereño SA
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Instagram className="w-6 h-6 text-yellow-400 mr-4" />
                    <div>
                      <p className="font-semibold text-gray-900">Instagram</p>
                      <a 
                        href="https://www.instagram.com/transporte.casereno.sa/?hl=es" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-yellow-400 transition-colors"
                      >
                        @transporte.casereno.sa
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black rounded-lg p-6 text-white">
                <h4 className="text-xl font-bold mb-3 text-yellow-400">Horario de Atención</h4>
                <p className="text-gray-300">
                  Lunes a Viernes: 8:00 - 18:00 hs<br />
                  Sábados: 8:00 - 12:00 hs<br />
                  Emergencias: 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestra Flota en Acción
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conoce nuestros camiones y el equipo que hace posible tus envíos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <img 
                src="/images/casereno2.png" 
                alt="Camión de carga pesada" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-semibold">Camiones de Carga Pesada</h3>
                <p className="text-sm">Capacidad para grandes volúmenes</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <img 
                src="/images/casereno3.png" 
                alt="Transporte de mercadería" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-semibold">Transporte Seguro</h3>
                <p className="text-sm">Tu mercadería protegida</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <img 
                src="/images/casereno4.png" 
                alt="Logística y distribución" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-semibold">Logística Eficiente</h3>
                <p className="text-sm">Distribución a todo el país</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
              Ver Más Fotos
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">El Casereño</h3>
              <p className="text-gray-400">
                Tu socio confiable en transporte de cargas a nivel nacional.
              </p>
              
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Transporte de Cargas Generales</li>
                <li>Carga Refrigerada</li>
                <li>Servicio Express</li>
                <li>Logística Integral</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
                <li><a href="#servicios" className="hover:text-white transition-colors">Servicios</a></li>
                <li><a href="#nosotros" className="hover:text-white transition-colors">Nosotros</a></li>
                <li><a href="#contacto" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-gray-400">
                <p>03775 15-63-8819 </p>
                <p>josegorbena@grupo-jlg.com</p>
                <p>av. Libertador 1280, Monte Caseros, Corrientes 3220</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Código20 : : : Todos los derechos reservados.</p> 
            <p className="text-gray-400"> Administrar </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5491112345678?text=Hola%20El%20Casereño,%20necesito%20información%20sobre%20sus%20servicios%20de%20transporte"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50 group"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          ¡Habla con nosotros!
        </span>
      </a>
    </div>
  )
}
