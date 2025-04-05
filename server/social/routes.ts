import { Router } from 'express';
import * as SocialController from './controller-fixed';

const router = Router();

// Platform management routes
router.get('/platforms', SocialController.getSocialPlatforms);
router.get('/available-platforms', SocialController.getAvailablePlatforms);
router.post('/connect', SocialController.connectPlatform);
router.delete('/platforms/:platformId', SocialController.disconnectPlatform);
router.get('/platforms/:platformId/validate', SocialController.validatePlatformConnection);

// Content posting routes
router.post('/platforms/:platformId/post', SocialController.postToSocialMedia);
router.delete('/platforms/:platformId/posts/:postId', SocialController.deletePost);

// Analytics routes
router.get('/platforms/:platformId/analytics', SocialController.getAccountAnalytics);
router.get('/platforms/:platformId/posts/:postId/analytics', SocialController.getPostAnalytics);
router.get('/platforms/:platformId/optimal-times', SocialController.getOptimalPostingTimes);

export default router;