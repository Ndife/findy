import Link from "next/link"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { buttonVariants } from "./ui/button"
import { LoginLink, RegisterLink, getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { ArrowRight } from "lucide-react"
import UserAccountNav from "./UserAccountNav"
import MobileNav from "./MobileNav"
import { getUserSubscriptionPlan } from "@/lib/stripe"

const Navbar = async () => {
  const { getUser } = getKindeServerSession()
  const user = getUser()
  const subscriptionPlan = await getUserSubscriptionPlan()

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href='/' className="flex z-40 font-semibold">
            <span>Findy.</span>
          </Link>

          <MobileNav isAuth={!!user} isSubscribed={subscriptionPlan?.isSubscribed}/>
          <div className=" hidden items-center space-x-4 sm:flex">
            {!user ? <>
              <Link
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                })} 
                href='/pricing'>
                  Pricing
                </Link>
                <LoginLink             
                  className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                })} > 
                  Sign in
                </LoginLink>
                <RegisterLink             
                  className={buttonVariants({
                  size: 'sm',
                })} > 
                  Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                </RegisterLink>
            </>: 
            <>
            <Link
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
              })} 
              href='/dashboard'>
                Dashboard
            </Link>

            <UserAccountNav subscriptionPlan={subscriptionPlan}  email={user.email ?? ''} name={
              !user.given_name || !user.family_name ? 'Your Account'
            : `${user.given_name } ${user.family_name}`} imageUrl={user.picture ?? ''} />
            </> }
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar