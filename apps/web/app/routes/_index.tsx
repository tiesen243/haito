import { Button } from '@haito/ui/button'
import { Typography } from '@haito/ui/typography'

export default function Index() {
  return (
    <main className='mx-auto flex max-w-prose flex-col px-4 py-16'>
      <header className='flex flex-col gap-2'>
        <Typography variant='h1'>The Great Frontend Migration</Typography>
        <Typography>
          A short tale of modern web development and the quest for the perfect
          UI library.
        </Typography>
      </header>

      <section>
        <Typography variant='h2'>Chapter 1: The Legacy Monolith</Typography>
        <Typography>
          In the beginning, there was only the monolith. It was a challenging
          time, where CSS was global, unpredictable, and components were tightly
          coupled. Every small change carried the risk of cascading layout
          failures across the kingdom.
        </Typography>
      </section>

      <section>
        <Typography variant='h2'>Chapter 2: A Component Renaissance</Typography>
        <Typography variant='h3'>Discovering Modularity</Typography>
        <Typography>
          Rumors began to spread across the engineering teams of a new paradigm.
          They spoke of encapsulated styles, variants, and composition. The
          developers started abstracting their basic elements.
        </Typography>

        <Typography variant='h4'>
          The Typography and Button Standardization
        </Typography>
        <Typography>
          By creating strict variants for headings and action elements, the
          designers and developers finally found peace. They were able to build
          faster and with more visual consistency than ever before.
        </Typography>
      </section>

      <section className='bg-accent text-accent-foreground mt-8 rounded-lg p-8'>
        <div className='flex flex-col items-center justify-center gap-4 text-center'>
          <Typography variant='h3'>Your journey awaits</Typography>
          <Typography>
            Are you ready to build the next generation of web applications?
          </Typography>
          <Button>Start Building</Button>
        </div>
      </section>
    </main>
  )
}
