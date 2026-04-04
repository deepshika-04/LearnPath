from collections import defaultdict, deque

class TopologicalSorter:
    """Generate learning path using topological sorting on topic DAG"""
    
    def __init__(self):
        self.graph = self._build_topic_graph()
        self.in_degree = defaultdict(int)
        self._calculate_in_degrees()
    
    def _build_topic_graph(self):
        """Build directed acyclic graph of topics with prerequisites"""
        graph = defaultdict(list)
        
        # Define topic prerequisites
        prerequisites = {
            'Arrays': [],
            'Strings': ['Arrays'],
            'LinkedLists': ['Pointers'],
            'Trees': ['LinkedLists'],
            'Graphs': ['Trees', 'Queues'],
            'DynamicProgramming': ['Arrays', 'Trees'],
            'Sorting': ['Arrays'],
            'Searching': ['Arrays', 'Sorting'],
            'Hashing': ['Arrays'],
            'Pointers': [],
            'Queues': ['LinkedLists'],
            'Stacks': ['LinkedLists'],
            'Heaps': [],
            'BitManipulation': [],
            'Greedy': [],
            'SQL': [],
            'Normalization': ['SQL'],
            'Transactions': ['SQL'],
            'Indexing': ['SQL'],
            'Processes': [],
            'Threads': ['Processes'],
            'Synchronization': ['Threads'],
            'Deadlocks': ['Synchronization'],
            'Memory': ['Processes'],
            'FileSystem': [],
            'OSI': [],
            'TCP_IP': ['OSI'],
            'DNS': ['OSI'],
            'HTTP': ['TCP_IP'],
            'Encryption': [],
            'Quantitative': [],
            'Logical': [],
            'Verbal': []
        }
        
        for topic, deps in prerequisites.items():
            for dep in deps:
                graph[dep].append(topic)
        
        return dict(graph)
    
    def _calculate_in_degrees(self):
        """Calculate in-degree for each node"""
        all_nodes = set()
        for node in self.graph:
            all_nodes.add(node)
            all_nodes.update(self.graph[node])
        
        for node in all_nodes:
            for neighbor in self.graph.get(node, []):
                self.in_degree[neighbor] += 1
    
    def topological_sort(self):
        """Perform Kahn's algorithm for topological sorting"""
        queue = deque([node for node in self.graph.keys() 
                      if self.in_degree[node] == 0])
        sorted_topics = []
        
        while queue:
            node = queue.popleft()
            sorted_topics.append(node)
            
            for neighbor in self.graph.get(node, []):
                self.in_degree[neighbor] -= 1
                if self.in_degree[neighbor] == 0:
                    queue.append(neighbor)
        
        return sorted_topics
    
    def generate_learning_path(self, weak_topics, strong_topics, company_weights, skill_level):
        """
        Generate personalized learning path
        
        Args:
            weak_topics: list of weak topics
            strong_topics: list of strong topics
            company_weights: dict of company topic importance
            skill_level: Beginner/Intermediate/Advanced
            
        Returns:
            ordered list of topics to study
        """
        sorted_topics = self.topological_sort()
        topic_catalog = set(sorted_topics) | set(company_weights.keys())
        
        # Prioritize weak topics
        learning_path = []
        difficulty_multiplier = {'Beginner': 1.0, 'Intermediate': 0.8, 'Advanced': 0.6}
        
        # Add weak topics first with high priority.
        # Quiz outputs domain-level topics (DSA/DBMS/OS/CN/Aptitude), so include
        # company-weight topics even if they are not present in the DAG.
        added_topics = set()
        for topic in weak_topics:
            if topic in topic_catalog and topic not in added_topics:
                priority = 'High'
                days = int(5 * difficulty_multiplier[skill_level])
                days = max(days, 1)
                learning_path.append({
                    'topicName': topic,
                    'priority': priority,
                    'prerequisites': self._get_prerequisites(topic),
                    'estimatedDays': days
                })
                added_topics.add(topic)
        
        # Add medium priority topics (company focused)
        medium_topics = [t for t in company_weights.keys() 
                        if t not in weak_topics and t not in strong_topics]
        for topic in medium_topics[:len(medium_topics)//2]:
            if topic in topic_catalog and topic not in added_topics:
                priority = 'Medium'
                days = int(3 * difficulty_multiplier[skill_level])
                days = max(days, 1)
                learning_path.append({
                    'topicName': topic,
                    'priority': priority,
                    'prerequisites': self._get_prerequisites(topic),
                    'estimatedDays': days
                })
                added_topics.add(topic)
        
        # Add low priority topics
        for topic in strong_topics:
            if topic in topic_catalog and topic not in added_topics:
                priority = 'Low'
                days = int(2 * difficulty_multiplier[skill_level])
                days = max(days, 1)
                learning_path.append({
                    'topicName': topic,
                    'priority': priority,
                    'prerequisites': self._get_prerequisites(topic),
                    'estimatedDays': days
                })
                added_topics.add(topic)

        # Guarantee a usable path even when weak/strong classification is sparse.
        if not learning_path:
            for topic in list(company_weights.keys())[:3]:
                learning_path.append({
                    'topicName': topic,
                    'priority': 'Medium',
                    'prerequisites': self._get_prerequisites(topic),
                    'estimatedDays': max(int(3 * difficulty_multiplier[skill_level]), 1)
                })
        
        return learning_path
    
    def _get_prerequisites(self, topic):
        """Get prerequisites for a topic"""
        prerequisites = {
            'Arrays': [],
            'Strings': ['Arrays'],
            'LinkedLists': ['Pointers'],
            'Trees': ['LinkedLists'],
            'Graphs': ['Trees', 'Queues'],
            'DynamicProgramming': ['Arrays', 'Trees'],
            'DSA': ['Arrays'],
            'DBMS': ['SQL'],
            'OS': ['Processes'],
            'CN': ['OSI'],
            'Aptitude': ['Quantitative'],
        }
        return prerequisites.get(topic, [])

# Initialize sorter
topo_sorter = TopologicalSorter()
