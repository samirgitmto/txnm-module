import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { SessionService } from './session.service';
import { Transaction, ApiResponse, BankConfig } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly bankConfigs: { [key: string]: BankConfig } = {
    'HDFC': {
      name: 'HDFC Bank',
      keyFormat: '^[A-Z]{4}[0-9]{7}$',
      keyHint: 'Format: ABCD1234567 (4 letters + 7 digits)',
      keyPlaceholder: 'Enter your HDFC statement key'
    },
    'ICICI': {
      name: 'ICICI Bank',
      keyFormat: '^[0-9]{10}$',
      keyHint: 'Format: 10 digits',
      keyPlaceholder: 'Enter your ICICI account number'
    },
    'SBI': {
      name: 'State Bank of India',
      keyFormat: '^[0-9]{11}$',
      keyHint: 'Format: 11 digits',
      keyPlaceholder: 'Enter your SBI account number'
    },
    'AXIS': {
      name: 'Axis Bank',
      keyFormat: '^[0-9]{12}$',
      keyHint: 'Format: 12 digits',
      keyPlaceholder: 'Enter your Axis account number'
    }
  };

  constructor(
    private baseApi: BaseApiService,
    private sessionService: SessionService
  ) {}

  getBankConfigs(): { [key: string]: BankConfig } {
    return this.bankConfigs;
  }

  validateBankKey(bankCode: string, key: string): boolean {
    const config = this.bankConfigs[bankCode];
    if (!config) return false;
    
    const regex = new RegExp(config.keyFormat);
    return regex.test(key);
  }

  parseTransactions(file: File, statementKey: string, bankCode: string): Observable<Transaction[]> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('statementKey', statementKey);
    formData.append('bankCode', bankCode);
    
    const sessionId = this.sessionService.getSessionId();
    if (sessionId) {
      formData.append('sessionId', sessionId);
    }

    console.log('Uploading file:', file.name);
    console.log('Statement Key:', statementKey);
    console.log('Bank Code:', bankCode);
    console.log('Session ID:', sessionId);

    return this.baseApi.postFormData<Transaction[]>('/transactions/parse', formData).pipe(
      map(response => {
        if (response.success && response.data) {
          console.log('Transactions parsed successfully:', response.data.length);
          return response.data;
        }
        throw new Error(response.message || 'Failed to parse transactions');
      }),
      catchError(error => {
        console.error('Transaction parsing error:', error);
        throw error;
      })
    );
  }

  getTransactions(): Observable<Transaction[]> {
    const sessionId = this.sessionService.getSessionId();
    if (!sessionId) {
      throw new Error('No active session');
    }

    return this.baseApi.get<Transaction[]>(`/transactions?sessionId=${sessionId}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch transactions');
      }),
      catchError(error => {
        console.error('Error fetching transactions:', error);
        throw error;
      })
    );
  }

  getTransactionAnalytics(period: 'daily' | 'weekly' | 'five-day'): Observable<any> {
    const sessionId = this.sessionService.getSessionId();
    if (!sessionId) {
      throw new Error('No active session');
    }

    return this.baseApi.get<any>(`/transactions/analytics/${period}?sessionId=${sessionId}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch analytics');
      }),
      catchError(error => {
        console.error('Error fetching analytics:', error);
        throw error;
      })
    );
  }
}
