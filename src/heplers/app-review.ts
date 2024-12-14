import { AppReview } from "@capawesome/capacitor-app-review";
import { parseInt } from "lodash";

const requestReview = async () => {
  try {
    await AppReview.requestReview();
  } catch (error) {
    console.error('Error requesting review:', error);
    openStoreReview();
  } finally {
    localStorage.setItem('hasAcceptedToReview', 'true');
  }
};

const openStoreReview = async () => {
  try {
    await AppReview.openAppStore();
  } catch (error) {
    console.error('Error opening store review:', error);
  }
};

const checkIfCanRequestReview = () => {
  const hasAcceptedToReview = localStorage.getItem('hasAcceptedToReview');
  const usageCount = parseInt(localStorage.getItem('appUsageCount') ?? '0');

  if (!usageCount) {
    localStorage.setItem('appUsageCount', '1');
    return false;
  }

  if (!hasAcceptedToReview) {
    localStorage.setItem('hasAcceptedToReview', 'false');
  }

  localStorage.setItem('appUsageCount', (usageCount + 1).toString());

  return usageCount % 3 === 0 && hasAcceptedToReview === 'false';
};

export { requestReview, openStoreReview, checkIfCanRequestReview };
