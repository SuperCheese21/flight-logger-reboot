import { Card, Hero } from 'react-daisyui';
import { Outlet } from 'react-router-dom';
import { AlertMessages } from 'stratosphere-ui';
import { DarkModeButton } from '../../common/components';

export const AuthenticationLayout = (): JSX.Element => (
  <Hero className="bg-base-200 min-h-screen">
    <Hero.Content className="w-full justify-around flex-wrap">
      <div className="text-center lg:text-left">
        <div className="font-title text-primary inline-flex text-lg transition-all duration-200 md:text-5xl">
          <span>Flight</span> <span className="text-base-content">Logger</span>
        </div>
        <p className="py-6">
          Welcome! Please login to access your flights and trips
        </p>
      </div>
      <Card className="flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100 mx-10">
        <Card.Body>
          <Outlet />
        </Card.Body>
      </Card>
    </Hero.Content>
    <AlertMessages maxMessages={4} />
    <div className="absolute top-0 right-0">
      <DarkModeButton />
    </div>
  </Hero>
);
