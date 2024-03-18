import { ERRORCODE, ERROR_MESSAGE } from '@libs/constants';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ImageAnalysisService {
  private endpoint = process.env.AZURE_CV_ENDPOINT;
  private subscriptionKey = process.env.AZURE_CV_SUBSCRIPTION_KEY;
  private analyzeUrl = this.endpoint + '/vision/v3.2/analyze';

  async analyzeImage(imageBuffer: Buffer) {
    const params = {
      visualFeatures: 'Categories,Description,Color,Adult',
      details: '',
      language: 'en',
    };

    const headers = {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
    };

    try {
      const response = await axios.post(this.analyzeUrl, imageBuffer, {
        params,
        headers,
      });
      console.log(response.data);
      if (
        response.data.adult.isAdultContent ||
        response.data.adult.isRacyContent
      ) {
        return {
          error: ERRORCODE.NET_E_IVALID_IMAGE,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_IVALID_IMAGE),
        };
      }

      if (
        response.data.adult.adultScore > 0.5 ||
        response.data.adult.racyScore > 0.5
      ) {
        return {
          error: ERRORCODE.NET_E_IVALID_IMAGE,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_IVALID_IMAGE),
        };
      }

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      console.error(error.response.data);
      return {
        error: ERRORCODE.NET_E_DB_FAILED,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
      };
    }
  }

  async analyzeImageUrl(imageUrl: string) {
    if (!imageUrl) {
      return {
        error: ERRORCODE.NET_E_IVALID_IMAGE,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_IVALID_IMAGE),
      };
    }

    const params = {
      visualFeatures: 'Categories,Description,Color,Adult',
      details: '',
      language: 'en',
    };

    const headers = {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
    };

    const body = {
      url: imageUrl,
    };

    try {
      const response = await axios.post(this.analyzeUrl, body, {
        params,
        headers,
      });
      if (
        response.data.adult.isAdultContent ||
        response.data.adult.isRacyContent
      ) {
        return {
          error: ERRORCODE.NET_E_IVALID_IMAGE,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_IVALID_IMAGE),
        };
      }

      if (
        response.data.adult.adultScore > 0.5 ||
        response.data.adult.racyScore > 0.5
      ) {
        return {
          error: ERRORCODE.NET_E_IVALID_IMAGE,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_IVALID_IMAGE),
        };
      }

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      console.error(error.response.data);
      return {
        error: ERRORCODE.NET_E_DB_FAILED,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
      };
    }
  }
}
