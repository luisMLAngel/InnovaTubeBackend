import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecaptchaService {
  private readonly secretKey = process.env.RECAPTCHA_SECRET_KEY;
  private readonly verifyUrl =
    'https://www.google.com/recaptcha/api/siteverify';

  async verify(token: string, action: string): Promise<boolean> {
    const { data } = await axios.post(this.verifyUrl, null, {
      params: {
        secret: this.secretKey,
        response: token,
      },
    });

    if (!data.success || data.action !== action) {
      return false;
    }

    return data.score >= 0.5;
  }
}
