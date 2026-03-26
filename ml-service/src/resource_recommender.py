import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class ResourceRecommender:
    """Recommend resources using cosine similarity"""
    
    def recommend_resources(self, user_topics, available_resources, target_company):
        """
        Recommend resources based on cosine similarity
        
        Args:
            user_topics: list of topics user needs to study
            available_resources: list of resource objects
            target_company: target company name
            
        Returns:
            list of recommended resource IDs
        """
        # Create user profile vector
        user_profile = self._create_user_profile(user_topics, available_resources)
        
        # Calculate similarity scores
        recommendations = []
        for resource in available_resources:
            resource_profile = self._create_resource_profile(resource)
            
            similarity = cosine_similarity(
                user_profile.reshape(1, -1),
                resource_profile.reshape(1, -1)
            )[0][0]
            
            # Boost score for company-relevant resources
            company_boost = 0.2 if target_company in resource.get('companyRelevance', []) else 0
            final_score = similarity + company_boost
            
            recommendations.append({
                'id': str(resource['id']),
                'score': float(final_score)
            })
        
        # Sort by score and return top recommendations
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return [r['id'] for r in recommendations[:10]]
    
    def _create_user_profile(self, user_topics, available_resources):
        """Create user preference vector"""
        topic_to_idx = {}
        idx = 0
        for resource in available_resources:
            topic = resource.get('topic')
            if topic not in topic_to_idx:
                topic_to_idx[topic] = idx
                idx += 1
        
        profile = np.zeros(len(topic_to_idx))
        for topic in user_topics:
            if topic in topic_to_idx:
                profile[topic_to_idx[topic]] = 1.0
        
        return profile if profile.sum() > 0 else np.ones(len(topic_to_idx)) / len(topic_to_idx)
    
    def _create_resource_profile(self, resource):
        """Create resource vector"""
        # Simplified profile: topic + difficulty + tags
        profile_features = []
        
        # Topic (one-hot would be used in practice)
        topic_score = 1.0 if resource.get('topic') else 0.0
        
        # Difficulty mapping: Easy=0.3, Medium=0.6, Hard=0.9
        difficulty_map = {'Easy': 0.3, 'Medium': 0.6, 'Hard': 0.9}
        difficulty_score = difficulty_map.get(resource.get('difficulty'), 0.5)
        
        # Type mapping: Video=0.8, Article=0.6, Problem=1.0
        type_map = {'Video': 0.8, 'Article': 0.6, 'Problem': 1.0}
        type_score = type_map.get(resource.get('type'), 0.5)
        
        return np.array([topic_score, difficulty_score, type_score])

recommender = ResourceRecommender()
