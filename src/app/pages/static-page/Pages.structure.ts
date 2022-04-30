import { SocialMedia } from './SocialMedia.structure';

export class Pages {
  _id: number;

  title: string = 'My website';

  slogan: string; // = 'the winter is coming';

  phone: string; // = '+583024012910';

  email: string; // = 'example@email.com';

  footer: string; // = 'footer here';

  domain: string; // = 'www.example.com';

  color_schemes: {
      primary: string, // '#ffff',
      secondary: string, // '#ffff',
      hover: string, // '#ffff',
      link_visited: string, // '#ffff',
      background_primary: string, // '#ffff',
      background_secondary: string, // '#ffff'
  };

  social_links: SocialMedia[];

  body: string; // '<h1>lorem</h1>'

  slug: string; // '/mission' "Predeterminado con generador"

  createdAt: number; // Hora local de creación

  updatedAt: number; // "Actualiza cada vez que hay cambio"

  site_id: string; // Sitio padre, importante

  is_active: boolean; // true

  idSite: string; // "SitioPrincipal"

  // Temporal para este code
  pageTypeCreate: string; // '';

  border: boolean; // = false;
}
