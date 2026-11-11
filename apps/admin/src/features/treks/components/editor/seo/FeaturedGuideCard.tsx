import { FormSection } from "@/components/ui/FormSection";
import { SelectField } from "@/components/ui/SelectField";

type FeaturedGuideCardProps = {
  /** The saved choice (null: none). */
  featuredArticleId: string | null;
  /** The website's published blog posts, A–Z. */
  options: { value: string; label: string }[];
  error?: string;
};

/**
 * "Read before you go" on a region website's trek page: the blog post shown first, large. Sent as featuredArticleId
 * ("" for none: the website's featured post comes first, as on the home page). A post unpublished since drops out.
 */
export const FeaturedGuideCard = ({ featuredArticleId, options, error }: FeaturedGuideCardProps) => (
  <FormSection title="Blog post shown first" hint="In “Read before you go” near the end of this trek’s page, the large card. The newest posts fill the cards beside it.">
    <SelectField
      name="featuredArticleId"
      label="Blog post"
      // "" is a real choice, so a picked post can be taken back.
      options={[{ value: "", label: "The website’s featured post (as on the home page)" }, ...options]}
      defaultValue={options.some((option) => option.value === featuredArticleId) ? (featuredArticleId ?? "") : ""}
      hint={options.length ? undefined : "No published blog posts yet: publish one in Travel guides first."}
      error={error}
    />
  </FormSection>
);
