import styles from './page.module.css';
import WaitlistForm from '@/components/WaitlistForm';
import Image from 'next/image';

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Left Side - Hero Content */}
        <div className={styles.leftSection}>
          <div className={styles.logoContainer}>
            <Image
              src="/images/logo.jpg"
              alt="Flip Royale Logo"
              width={120}
              height={120}
              priority
              className={styles.logo}
            />
          </div>

          <h1 className={styles.title}>
            <span className={styles.titleGradient}>Flip Royale</span>
          </h1>

          <p className={styles.subtitle}>
            The Ultimate Web3 Card Game on Virtual Protocol
          </p>

          <div className={styles.badge}>
            <span className={styles.badgeIcon}>⚡</span>
            Built on Virtual Protocol
          </div>

          {/* Features - Compact */}
          <div className={styles.featuresCompact}>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🎴</span>
              <div>
                <span className={styles.featureTitle}>Choose 5 Cards</span>
                <span className={styles.featureSubtext}>Choose Up or Down</span>
              </div>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>📈</span>
              <div>
                <span className={styles.featureTitle}>Earn Points</span>
              </div>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🏆</span>
              <div>
                <span className={styles.featureTitle}>Win Rewards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Waitlist Form */}
        <div className={styles.rightSection}>
          <WaitlistForm />
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; 2025 Flip Royale. Built on Virtual Protocol.</p>
      </footer>
    </div>
  );
}
