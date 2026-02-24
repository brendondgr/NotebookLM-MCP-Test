// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

async function init() {
    try {
        const response = await fetch('/data/alphafold3.json');
        if (!response.ok) throw new Error('Data fetch failed');
        const data = await response.json();

        populateData(data);
        setupAnimations();
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}

function populateData(data) {
    // Hero
    document.getElementById('subtitle').innerText = data.subtitle;

    // Intro
    document.getElementById('intro-what').innerText = data.introduction.what_is_it;
    document.getElementById('intro-goal').innerText = data.introduction.primary_goal;

    // Comparison
    const compGrid = document.getElementById('comparison-grid');
    data.comparison_af2.points.forEach((point, index) => {
        const div = document.createElement('div');
        div.className = 'glass-panel p-8 rounded-2xl reveal-section transform transition-transform hover:-translate-y-2 hover:border-[#66fcf1]/50';
        div.innerHTML = `
            <div class="text-[#8a2be2] font-mono text-sm mb-2">0${index + 1}</div>
            <h4 class="text-2xl font-bold text-white mb-3">${point.topic}</h4>
            <p class="text-gray-300 leading-relaxed">${point.description}</p>
        `;
        compGrid.appendChild(div);
    });

    // Architecture
    document.getElementById('arch-desc').innerText = data.architecture.description;
    const archBlocks = document.getElementById('arch-blocks');
    data.architecture.blocks.forEach((block, index) => {
        const div = document.createElement('div');
        div.className = 'arch-card glass-panel p-8 rounded-2xl border-l-2 border-l-[#66fcf1]';
        div.innerHTML = `
            <h4 class="text-xl md:text-2xl font-bold text-white mb-4">${block.name}</h4>
            <p class="text-gray-300 leading-relaxed">${block.detail}</p>
        `;
        archBlocks.appendChild(div);
    });

    // Downfalls & Gaps
    const downfallsContainer = document.getElementById('downfalls-container');
    data.downfalls_and_gaps.downfalls.forEach(df => {
        const div = document.createElement('div');
        div.className = 'glass-panel p-6 rounded-xl reveal-section border border-gray-800';
        div.innerHTML = `
            <h5 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                ${df.issue}
            </h5>
            <p class="text-sm text-gray-400 mb-3">${df.detail}</p>
            <div class="bg-[#1f2833]/50 p-3 rounded-lg border border-green-500/20">
                <span class="text-green-400 text-xs font-bold uppercase tracking-wider block mb-1">Resolution</span>
                <p class="text-sm text-gray-300">${df.resolution}</p>
            </div>
        `;
        downfallsContainer.appendChild(div);
    });

    const gapsList = document.getElementById('gaps-list');
    data.downfalls_and_gaps.gaps.forEach(gap => {
        const li = document.createElement('li');
        li.innerHTML = gap;
        gapsList.appendChild(li);
    });

    // Sources
    const sourcesContainer = document.getElementById('sources-container');
    data.sources.forEach(src => {
        const link = document.createElement('a');
        link.href = src.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className = 'px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-xs text-gray-400 hover:text-white hover:border-[#66fcf1] transition-colors cursor-pointer inline-block';
        link.innerText = src.title;
        sourcesContainer.appendChild(link);
    });
}

function setupAnimations() {
    // Initial hero load animation
    const tl = gsap.timeline();
    tl.from('#hero-content', { opacity: 0, y: 50, duration: 1.5, ease: "power3.out" })
      .from('#main-title', { opacity: 0, scale: 0.9, duration: 1, ease: "back.out(1.7)" }, "-=1")
      .from('#subtitle', { opacity: 0, duration: 1 }, "-=0.5");

    // Standard reveal sections
    gsap.utils.toArray('.reveal-section').forEach(section => {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Architecture cards staggered entrance
    gsap.from(".arch-card", {
        scrollTrigger: {
            trigger: "#arch-blocks",
            start: "top 80%"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });
}

// Run init when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
