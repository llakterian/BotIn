import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useThemeStore, colors } from '../store/useThemeStore';

const DEMO_SRC = '/media/botin-demo.webm';
const DEMO_POSTER = '/media/botin-demo-poster.jpg';

const DemoVideo: React.FC = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? colors.dark : colors.light;

  return (
    <section
      className="rounded-2xl overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.border}` }}
      aria-label="BotIn demo video"
    >
      <div className="px-5 pt-5 pb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color: theme.text }}>
            Watch the demo
          </h2>
          <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
            The live app in one take: agent profiles, the API marketplace and an agent
            card anchored on the Concordium testnet.
          </p>
        </div>
        <a
          href={DEMO_SRC}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap"
          style={{ color: theme.primary }}
        >
          <ExternalLink className="w-4 h-4" />
          Open the recording
        </a>
      </div>

      <div className="px-5 pb-5">
        <video
          className="w-full rounded-xl"
          style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}
          controls
          playsInline
          preload="metadata"
          poster={DEMO_POSTER}
        >
          <source src={DEMO_SRC} type="video/webm" />
          Your browser cannot play this recording. It is also available at{' '}
          {DEMO_SRC}
        </video>
        <p className="mt-2 text-xs" style={{ color: theme.textSecondary }}>
          Two minutes and seventeen seconds, no cuts. The screen recording has no audio.
        </p>
      </div>
    </section>
  );
};

export default DemoVideo;
