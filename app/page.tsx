import { Button } from '@/components/ui/button'
import { PricingTable, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function Page() {
  return (
    <div className='landing-wrapper'>
      <header className='landing-header'>
        <div className='landing-header-inner'>
          <div className='logo-container'>
            <Link href={"/"}>
              <span className='logo-text'>ExecOS</span>
            </Link>
            <Show when="signed-in">
              <div className='nav-actions'>
                <Link href="/dashboard">
                  <Button variant={"ghost"}>
                    Dashboard
                  </Button>
                </Link>
                <UserButton />
              </div>
            </Show>
            <Show when="signed-out">
              <div className='nav-actions'>
                <SignInButton />
                <SignUpButton />
              </div>
            </Show>

          </div>
        </div>
      </header>
      <section className="hero-section">
        <h2>Simple, Transparent Pricing</h2>
        <PricingTable />
      </section>
    </div>
  )
}