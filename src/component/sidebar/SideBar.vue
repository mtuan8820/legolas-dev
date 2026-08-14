<template>
  <aside class="fixed top-11.25 left-0 h-full w-72">
    <div class="h-full p-8 flex flex-col items-center gap-8">
      <div class="text-center">
        <h2 class="text-[1.4em]">Minh Tuan</h2>
        <p class="text-[22px] leading-normal text-[#aaa] font-extrabold">An Engineer</p>
      </div>

      <!-- Social Links -->
      <div class="flex gap-4">
        <a href="https://github.com/mtuan8820" class="hover:opacity-75">
          <img src="@/assets/icons/github.svg" alt="GitHub" class="w-6 h-6" />
        </a>
        <a href="mailto:mtuan9517@gmail.com" class="hover:opacity-75">
          <img src="@/assets/icons/gmail.svg" alt="Email" class="w-6 h-6" />
        </a>
        <a href="https://www.linkedin.com/in/vuhoangminhtuan/" class="hover:opacity-75">
          <img src="@/assets/icons/linkedin-svgrepo-com.svg" alt="LinkedIn" class="w-6 h-6" />
        </a>
      </div>

      <nav class="w-full flex flex-1 flex-col">
        <RouterLink class="py-4 text-center border-b border-b-[#ececec]" to="/blogs"
          >Blogs</RouterLink
        >
        <RouterLink class="py-4 text-center border-b border-b-[#ececec]" to="/"
          >About Me</RouterLink
        >
        <RouterLink class="py-4 text-center border-b border-b-[#ececec]" to="/projects"
          >Projects</RouterLink
        >
        <RouterLink class="py-4 text-center border-b border-b-[#ececec]" to="/til"
          >Today I Learned</RouterLink
        >
      </nav>

      <div class="mb-11.25">© 2026 Legolas</div>
    </div>
  </aside>
</template>
