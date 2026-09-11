import { useEffect, useState } from 'react'

interface AnimatedHeadingProps {
  text: string
  className?: string
  style?: React.CSSProperties
  initialDelay?: number
}

const CHAR_DELAY = 30
const CHAR_DURATION = 500

export default function AnimatedHeading({
  text,
  className = '',
  style = {},
  initialDelay = 200,
}: AnimatedHeadingProps) {
  const [started, setStarted] = useState(false)
  const lines = text.split('\n')

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), initialDelay)
    return () => clearTimeout(timer)
  }, [initialDelay])

  return (
    <h1 className={className} style={style}>
      {lines.map((line, lineIndex) => {
        const chars = line.split('')
        return (
          <span key={lineIndex} style={{ display: 'block' }}>
            {chars.map((char, charIndex) => {
              const delay =
                lineIndex * chars.length * CHAR_DELAY + charIndex * CHAR_DELAY
              return (
                <span
                  key={charIndex}
                  style={{
                    display: 'inline-block',
                    opacity: started ? 1 : 0,
                    transform: started ? 'translateX(0)' : 'translateX(-18px)',
                    transition: `opacity ${CHAR_DURATION}ms, transform ${CHAR_DURATION}ms`,
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              )
            })}
          </span>
        )
      })}
    </h1>
  )
}
