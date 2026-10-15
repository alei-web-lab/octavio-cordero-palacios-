import "./index.css";
import { CampaignComposition } from "./Composition";
import { CampaignOutroComposition } from "./Outro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <CampaignComposition />
      <CampaignOutroComposition />
    </>
  );
};
