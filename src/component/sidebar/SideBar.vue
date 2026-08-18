<template>
  <aside class="fixed top-11.25 left-0 h-full w-72">
    <div class="h-full p-8 flex flex-col items-center gap-8">
      <div class="text-center">
        <h2 class="text-[1.4em] font-normal!">Legolas</h2>
        <h3 class="text-[#888]! font-extrabold!">Backend Engineer</h3>
      </div>

      <!-- Social Links -->
      <div class="flex gap-4">
        <a
          href="https://github.com/mtuan8820"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          class="text-[#666] hover:text-[#181717] transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="currentColor"
          >
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            />
          </svg>
        </a>
        <a
          href="mailto:mtuan9517@gmail.com"
          aria-label="Email"
          class="text-[#666] hover:text-[#EA4335] transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="currentColor"
          >
            <path
              d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
            />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/vuhoangminhtuan/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          class="text-[#666] hover:text-[#0A66C2] transition-colors"
        >
          <svg
            viewBox="0 0 504.4 504.4"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="currentColor"
          >
            <path
              d="M377.6,0.2H126.4C56.8,0.2,0,57,0,126.6v251.6c0,69.2,56.8,126,126.4,126H378c69.6,0,126.4-56.8,126.4-126.4V126.6
				C504,57,447.2,0.2,377.6,0.2z M168,408.2H96v-208h72V408.2z M131.6,168.2c-20.4,0-36.8-16.4-36.8-36.8c0-20.4,16.4-36.8,36.8-36.8
				c20.4,0,36.8,16.4,36.8,36.8C168,151.8,151.6,168.2,131.6,168.2z M408.4,408.2H408h-60V307.4c0-24.4-3.2-55.6-36.4-55.6
				c-34,0-39.6,26.4-39.6,54v102.4h-60v-208h56v28h1.6c8.8-16,29.2-28.4,61.2-28.4c66,0,77.6,38,77.6,94.4V408.2z"
            />
          </svg>
        </a>
      </div>

      <nav class="w-full flex flex-1 flex-col px-2">
        <RouterLink class="router-link" to="/blogs">Blogs</RouterLink>
        <RouterLink class="router-link" to="/">About Me</RouterLink>
        <RouterLink class="router-link" to="/projects">Projects</RouterLink>
        <RouterLink class="router-link" to="/til">Today I Learned</RouterLink>
      </nav>

      <div class="mb-11.25">© 2026 Legolas</div>
    </div>
  </aside>
</template>
