'use client'

import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    alpha: number
    alphaDir: number
    color: string
    pulse: number
    pulseSpeed: number
}

const COLORS = [
    'rgba(99, 102, 241,',   // indigo-500
    'rgba(139, 92, 246,',   // violet-500
    'rgba(168, 85, 247,',   // purple-500
    'rgba(79, 70, 229,',    // indigo-600
    'rgba(255, 255, 255,',  // white
]

export default function AuthCanvasBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationId: number
        let particles: Particle[] = []
        const PARTICLE_COUNT = 80
        const CONNECTION_DISTANCE = 130

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        const randomBetween = (a: number, b: number) => a + Math.random() * (b - a)

        const createParticle = (): Particle => ({
            x: randomBetween(0, canvas.width),
            y: randomBetween(0, canvas.height),
            vx: randomBetween(-0.4, 0.4),
            vy: randomBetween(-0.4, 0.4),
            radius: randomBetween(1.5, 4),
            alpha: randomBetween(0.3, 0.9),
            alphaDir: Math.random() > 0.5 ? 1 : -1,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            pulse: randomBetween(0, Math.PI * 2),
            pulseSpeed: randomBetween(0.01, 0.03),
        })

        const init = () => {
            particles = Array.from({ length: PARTICLE_COUNT }, createParticle)
        }

        const drawParticle = (p: Particle) => {
            p.pulse += p.pulseSpeed
            const pulsedRadius = p.radius + Math.sin(p.pulse) * 0.8

            // Glow effect
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulsedRadius * 4)
            gradient.addColorStop(0, `${p.color}${p.alpha})`)
            gradient.addColorStop(0.5, `${p.color}${p.alpha * 0.4})`)
            gradient.addColorStop(1, `${p.color}0)`)

            ctx.beginPath()
            ctx.arc(p.x, p.y, pulsedRadius * 4, 0, Math.PI * 2)
            ctx.fillStyle = gradient
            ctx.fill()

            // Core dot
            ctx.beginPath()
            ctx.arc(p.x, p.y, pulsedRadius, 0, Math.PI * 2)
            ctx.fillStyle = `${p.color}${p.alpha})`
            ctx.fill()
        }

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist < CONNECTION_DISTANCE) {
                        const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.25
                        ctx.beginPath()
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.strokeStyle = `rgba(200, 200, 255, ${opacity})`
                        ctx.lineWidth = 0.8
                        ctx.stroke()
                    }
                }
            }
        }

        const drawFloatingOrbs = (time: number) => {
            const orbConfigs = [
                { x: 0.15, y: 0.25, r: 180, color1: 'rgba(99,102,241,0.18)', color2: 'rgba(99,102,241,0)' },
                { x: 0.85, y: 0.15, r: 220, color1: 'rgba(139,92,246,0.15)', color2: 'rgba(139,92,246,0)' },
                { x: 0.9, y: 0.8, r: 200, color1: 'rgba(79,70,229,0.14)', color2: 'rgba(79,70,229,0)' },
                { x: 0.1, y: 0.85, r: 160, color1: 'rgba(168,85,247,0.12)', color2: 'rgba(168,85,247,0)' },
            ]

            orbConfigs.forEach((orb, i) => {
                const floatX = canvas.width * orb.x + Math.sin(time * 0.0004 + i * 1.3) * 30
                const floatY = canvas.height * orb.y + Math.cos(time * 0.0005 + i * 0.9) * 25

                const grad = ctx.createRadialGradient(floatX, floatY, 0, floatX, floatY, orb.r)
                grad.addColorStop(0, orb.color1)
                grad.addColorStop(1, orb.color2)

                ctx.beginPath()
                ctx.arc(floatX, floatY, orb.r, 0, Math.PI * 2)
                ctx.fillStyle = grad
                ctx.fill()
            })
        }

        const update = (p: Particle) => {
            p.x += p.vx
            p.y += p.vy

            // Alpha pulsing
            p.alpha += p.alphaDir * 0.005
            if (p.alpha > 0.9 || p.alpha < 0.2) p.alphaDir *= -1

            // Wrap around edges
            if (p.x < -10) p.x = canvas.width + 10
            if (p.x > canvas.width + 10) p.x = -10
            if (p.y < -10) p.y = canvas.height + 10
            if (p.y > canvas.height + 10) p.y = -10
        }

        let startTime: number | null = null

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const elapsed = timestamp - startTime

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            drawFloatingOrbs(elapsed)
            drawConnections()
            particles.forEach(p => {
                update(p)
                drawParticle(p)
            })

            animationId = requestAnimationFrame(animate)
        }

        resize()
        init()
        animationId = requestAnimationFrame(animate)

        const handleResize = () => {
            resize()
            init()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
            aria-hidden="true"
        />
    )
}