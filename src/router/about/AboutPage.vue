<script lang="ts" setup>
import { useToast } from 'vue-toast-notification'

const $toast = useToast()
async function copyEmail() {
  await navigator.clipboard.writeText('mtuan9517@email.com')
  const instance = $toast.open('Copied to clipboard!')

  setTimeout(() => {
    instance.dismiss()
  }, 1000)
}
</script>
<template>
  <div>
    <h1>Hi, I'm Tuan</h1>

    <p>
      I'm an engineer based in Ho Chi Minh, Viet Nam.<br />

      I mostly work with
      <img src="@/assets/icons/Go-Logo_Blue.svg" alt="Go" class="inline w-8 h-8" />,
      <img src="@/assets/icons/java-ar21.svg" alt="Java" class="inline h-7" />,
      <img src="@/assets/icons/ts-lettermark-white.svg" alt="TypeScript" class="inline h-6" />
      and occasionally experiment with other languages. <br />

      I enjoy working on personal projects to explore new technologies and deepen my understanding
      of software engineering.<br />

      Most of my projects focus on backend systems, APIs, and developer tools.<br />

      I scored 865/990 on the TOEIC Listening & Reading and passed the JLPT N3 in 2026.
    </p>
  </div>

  <div>
    <h3>Now</h3>
    <ul class="list-disc list-inside">
      <li>Learning Rust - recently built a regex engine from scratch.</li>
      <li>Studying toward JLPT N2.</li>
      <li>
        Visit <RouterLink class="underline" to="/til">Today I Learned</RouterLink> to explore things
        I learned recently.
      </li>
    </ul>
  </div>

  <div>
    <h3>Contact</h3>
    <p class="mb-0!">My resume can be downloaded at these links:</p>
    <ul class="list-disc list-inside">
      <li>
        <a
          class="underline"
          target="_blank"
          href="https://drive.google.com/file/d/1N_HiuTZoT6SnpatahC7JD9-Wgmqu6SGu/view?usp=sharing"
          >English</a
        >
      </li>
      <li>
        <a>Japanese</a>
      </li>
    </ul>
    <p>
      You can contact me via my email at
      <span class="underline cursor-pointer" @click.prevent="copyEmail"> mtuan9517@gmail.com </span>
    </p>
  </div>
</template>
