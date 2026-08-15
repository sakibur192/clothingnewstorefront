// ============================================================
// SECTION RENDERER
// ============================================================
// Takes the `sections` array from a storefront_pages row and
// renders each one with the matching component. Unknown section
// types are just skipped instead of crashing the page.
// ============================================================

import Hero from "./sections/Hero";
import HeroSlider from "./sections/HeroSlider";
import Banner from "./sections/Banner";
import CategoryGrid from "./sections/CategoryGrid";
import CategoryIconGrid from "./sections/CategoryIconGrid";
import ProductGrid from "./sections/ProductGrid";
import Testimonials from "./sections/Testimonials";
import Newsletter from "./sections/Newsletter";
import TrustBadges from "./sections/TrustBadges";
import PromoGrid from "./sections/PromoGrid";
import FlashSale from "./sections/FlashSale";
import InstagramGallery from "./sections/InstagramGallery";
import BrandStory from "./sections/BrandStory";
import PartnerLogos from "./sections/PartnerLogos";
import AppPromoBar from "./sections/AppPromoBar";
import CouponStrip from "./sections/CouponStrip";

const SECTION_COMPONENTS = {
  hero: Hero,
  hero_slider: HeroSlider,
  banner: Banner,
  category_grid: CategoryGrid,
  category_icon_grid: CategoryIconGrid,
  product_grid: ProductGrid,
  testimonials: Testimonials,
  newsletter: Newsletter,
  trust_badges: TrustBadges,
  promo_grid: PromoGrid,
  flash_sale: FlashSale,
  instagram_gallery: InstagramGallery,
  brand_story: BrandStory,
  partner_logos: PartnerLogos,
  app_promo_bar: AppPromoBar,
  coupon_strip: CouponStrip,
};

export default function SectionRenderer({ sections }) {
  if (!sections || sections.length === 0) {
    return <p className="empty-page">This page has no content yet.</p>;
  }

  return (
    <>
      {sections.map((section, index) => {
        const Component = SECTION_COMPONENTS[section.type];
        if (!Component) return null;
        return <Component key={index} settings={section.settings || {}} />;
      })}
    </>
  );
}
