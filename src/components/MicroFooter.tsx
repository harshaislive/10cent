export default function MicroFooter() {
  return (
    <footer className="bg-stone-100 border-t border-stone-200 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-xl mb-4 text-stone-900">
              Beforest Club
            </h3>
            <p className="text-sm text-stone-600 mb-4">
              Return to yourself. 30 nights at a time.
            </p>
            <p className="text-xs text-stone-500">
              Across India's wildest landscapes.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4 text-stone-900">Philosophy</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>10% of your year</li>
              <li>30 nights in wilderness</li>
              <li>150 founding members</li>
              <li>No ownership, just access</li>
            </ul>
          </div>

          </div>

        <div className="border-t border-stone-300 pt-8">
          <div className="text-center">
            <p className="text-xs text-stone-500 mb-2">
              © 2025 Beforest 10cent Club. All rights reserved.
            </p>
            <div className="text-xs text-stone-400 space-x-4">
              <a href="https://beforest.co/privacy-policy/" className="hover:text-stone-600 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="https://beforest.co/terms-and-conditions/" className="hover:text-stone-600 transition-colors">Terms & Conditions</a>
              <span>•</span>
              <a href="#" className="hover:text-stone-600 transition-colors">Membership Philosophy</a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-stone-400 italic">
            The most important meetings are the ones you take with yourself.
          </p>
        </div>
      </div>
    </footer>
  )
}