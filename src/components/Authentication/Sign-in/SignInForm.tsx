import Image from 'next/image'
import React from 'react'

export default function SignInForm() {
  return (
    <div>
      <form action="">
        <h2>Sign Up Account</h2>
        <p>Enter your personal information to create your account</p>

        <div>
          <button>
            <Image src="/google.png" alt="google" />
            <span>Google</span>
          </button>
          <button>
            <Image src="/github.png" alt="google" />
            <span>Github</span>
          </button>
        </div>
      </form>
    </div>
  )
}
