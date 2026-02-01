export default function Home() {
  const dummyPosts = [
    {
      id: 1,
      author: 'Sarah Jenkins',
      role: 'Computer Science • Senior',
      time: '2h ago',
      title: 'Has anyone taken CS401 with Prof. Miller?',
      content: 'I heard the final project is brutal. Looking for advice on how to prepare properly. Also, are the textbooks actually required?',
      tags: ['Academics', 'CS401'],
      upvotes: 24,
      comments: 8,
    },
    {
      id: 2,
      author: 'Campus Events',
      role: 'Official',
      time: '4h ago',
      title: 'Hackathon Registration is OPEN! 🚀',
      content: 'Join us for the annual Spring Hackathon this weekend at the Student Center. Free food, cool prizes, and great networking opportunities.',
      tags: ['Events', 'Hackathon'],
      upvotes: 156,
      comments: 32,
    },
    {
      id: 3,
      author: 'Mike Chen',
      role: 'Engineering • Junior',
      time: '5h ago',
      title: 'Lost my AirPods case in the library 😭',
      content: 'Left it on the 3rd floor quiet study area table 4. Please DM if found!',
      tags: ['Lost & Found'],
      upvotes: 12,
      comments: 2,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Your Campus Feed</h2>
        <p className="text-gray-500 mt-2">See what's happening around you right now.</p>
      </header>

      {/* Create Post Placeholder */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 transition">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">You</div>
        <input type="text" placeholder="Start a discussion..." className="bg-transparent flex-1 outline-none text-gray-600" disabled />
      </div>

      <div className="space-y-4">
        {dummyPosts.map((post) => (
          <article key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">{post.author}</div>
                <div className="text-xs text-gray-500">{post.role} • {post.time}</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">{post.content}</p>
            <div className="flex items-center space-x-4">
              {post.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">#{tag}</span>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-gray-500 text-sm">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 hover:text-blue-600">
                  <span>⬆</span> <span>{post.upvotes}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-blue-600">
                  <span>💬</span> <span>{post.comments} Comments</span>
                </button>
              </div>
              <button className="hover:text-blue-600">Share</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
