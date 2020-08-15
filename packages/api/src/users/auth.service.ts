import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { encode, decode, escape, unescape } from 'base64-url';
import {
  createPublicKey,
  createPrivateKey,
  createSign,
  createVerify,
  KeyObject,
} from 'crypto';
import { InvalidTokenException } from './invalid-token.exception';

@Injectable()
export class AuthService {
  private publicKey: KeyObject;
  private privateKey: KeyObject;

  constructor(configService: ConfigService) {
    this.publicKey = createPublicKey(configService.get('auth.publicKey'));
    this.privateKey = createPrivateKey(configService.get('auth.privateKey'));
    if (!(this.publicKey && this.privateKey)) {
      throw new Error('AuthService: missing keys');
    }
  }

  stringifySubject({ userId, userAuthId }) {
    return `u:${userId},${userAuthId}`;
  }

  parseSubject(sub) {
    const [userId, userAuthId] = sub.split(':')[1].split(',');
    return { userId, userAuthId };
  }

  createToken({
    userId,
    userAuthId,
    type,
  }: {
    userId: string;
    userAuthId: string;
    type: 'refresh' | 'access';
  }) {
    const iatms = Date.now();
    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
      sub: this.stringifySubject({ userId, userAuthId }),
      iat: Math.floor(iatms / 1000),
      iatms,
      aud: type,
    };
    const encodedHeader = encode(JSON.stringify(header));
    const encodedPayload = encode(JSON.stringify(payload));
    const signer = createSign('RSA-SHA256');
    signer.write(`${encodedHeader}.${encodedPayload}`);
    const encodedSignature = escape(signer.sign(this.privateKey, 'base64'));
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  readToken(
    token: string,
  ): {
    userId: string;
    userAuthId: string;
    issuedAt: Date;
    type: 'access' | 'refresh';
  } {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    const header = JSON.parse(decode(encodedHeader));
    const payload = JSON.parse(decode(encodedPayload));
    const signature = unescape(encodedSignature);
    const verifier = createVerify('RSA-SHA256');
    verifier.write(`${encodedHeader}.${encodedPayload}`);
    const verified = verifier.verify(this.publicKey, signature, 'base64');
    if (!verified) {
      throw new InvalidTokenException('Signature verification failed');
    }

    const { sub, iat, iatms, aud } = payload;
    if (Math.floor(iatms / 1000) !== iat) {
      throw new InvalidTokenException(
        'Mismatch between iat and iatms (milliseconds)',
      );
    }
    const { userId, userAuthId } = this.parseSubject(sub);
    return {
      userId,
      userAuthId,
      issuedAt: new Date(iatms),
      type: aud,
    };
  }
}
