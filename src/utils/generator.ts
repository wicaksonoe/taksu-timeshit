import moment from 'moment';
import { UserSchema } from '../models/users';

export interface GeneratorBaseResponse {
  is_success: boolean;
  message: string;
}

export async function GenerateTimeSheetUrl(
  user: UserSchema,
  date?: string
): Promise<GeneratorBaseResponse> {
  const fields = [
    {
      key: 'entry.2116052852',
      value: user.name.replace(/\s/g, '+')
    },
    {
      key: 'entry.532096719',
      value: user.position.replace(/\s/g, '+')
    },
    {
      key: 'entry.1369552271',
      value: user.project.replace(/\s/g, '+')
    },
    {
      key: 'entry.1060472253',
      value: date ?? moment().format('YYYY-MM-DD')
    },
    {
      key: 'entry.813213160',
      value: '08:00'
    },
    {
      key: 'entry.1923238489',
      value: '17:00'
    }
  ];

  const parsedQuery = fields.map((x) => `${x.key}=${x.value}`).join('&');

  return {
    is_success: true,
    message: parsedQuery
  };
}
