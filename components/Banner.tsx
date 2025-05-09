import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

export default function Banner() {
  // const unitId = TestIds.BANNER;
  const unitId = 'ca-app-pub-4739003769773423/5429217778';
  return (
    <BannerAd
      // ios
      unitId={unitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
}
