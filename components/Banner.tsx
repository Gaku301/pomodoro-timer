import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

export default function Banner() {
  return (
    <BannerAd
      // ios
      unitId="ca-app-pub-4739003769773423/5429217778"
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
}
