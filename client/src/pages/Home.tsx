import { useNavigate } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import AnimatedHeading from '../components/AnimatedHeading'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Content sits above the video, pinned to the bottom-left */}
      <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-12 lg:px-16 pb-12 lg:pb-16">
        <AnimatedHeading
          text={'Find your place,\nintelligently.'}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4 max-w-3xl"
          style={{ letterSpacing: '-0.04em' }}
        />

        <FadeIn delay={800} duration={1000}>
          <p className="text-base md:text-lg text-gray-300 mb-5 max-w-xl">
            Smarter property recommendations, matched to your budget and
            your life.
          </p>
        </FadeIn>

        <FadeIn delay={1200} duration={1000}>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors w-fit"
          >
            Start a Chat
          </button>
        </FadeIn>
      </div>
    </div>
  )
}
