import { Card, Hero } from 'react-daisyui';
import { Outlet } from 'react-router-dom';

export const AuthenticationLayout = (): JSX.Element => (
  <Hero className="bg-base-200 min-h-screen">
    <Hero.Content className="flex-col lg:flex-row-reverse">
      <div className="text-center lg:text-left">
        <div className="font-title text-primary inline-flex text-lg transition-all duration-200 md:text-5xl">
          <span>Flight</span> <span className="text-base-content">Logger</span>
        </div>
        <p className="py-6">
          Welcome! Please choose a login method to get started
        </p>
      </div>
      <Card className="flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mr-10">
        <Card.Body>
          <Outlet />
        </Card.Body>
      </Card>
    </Hero.Content>
  </Hero>
);