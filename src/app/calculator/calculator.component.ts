import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  expression: string = '';
  result: string = '';
  equalDisplayed: boolean = false;
  customButtonClicked: boolean = false;
  history: { expression: string, result: string }[] = [];

  displayExpression: HTMLElement | null = null;
  displayResult: HTMLElement | null = null;

  ngOnInit(): void {
    this.displayExpression = document.querySelector('.expression');
    this.displayResult = document.querySelector('.result');
    const keys = document.querySelectorAll('.key');

    keys.forEach(key => {
      key.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const value = target.getAttribute('data-value');
        if (value) {
          this.handleKeyClick(value);
        }
      });
    });

    this.updateDisplay();
  }

  handleKeyClick(value: string): void {
    switch (value) {
      case '=':
        if (!this.equalDisplayed && this.expression !== '') {
          this.calculate();
          this.equalDisplayed = true;
        }
        break;
      case 'C':
        this.clear();
        break;
      case '+/-':
        this.negate();
        break;
      case '%':
        if (this.expression !== '') {
          this.percent();
          this.equalDisplayed = false;
        }
        break;
      case '/':
      case '*':
      case '+':
      case '-':
        if (this.expression !== '') {
          this.appendValue(value);
          this.equalDisplayed = false;
        }
        break;
      case 'geçmiş işlemler':
        this.showHistory();
        break;
      default:
        this.appendValue(value);
        this.equalDisplayed = false;
    }
  }

  percent(): void {
    this.expression = `(${this.expression}) / 100`;
    this.calculate(); // İşlemi hesapla ve geçmişe ekle
    this.updateDisplay();
  }

  negate(): void {
    if (this.expression !== '' && this.expression[0] !== '-') {
      this.expression = '-' + this.expression;
    } else if (this.expression[0] === '-') {
      this.expression = this.expression.slice(1);
    }
    this.updateDisplay();
  }

  appendValue(value: string): void {
    if (value === 'x') {
        value = '*';
    }

    // Operatörlerin arka arkaya gelmesini engelle
    const lastChar = this.expression[this.expression.length - 1];
    const operators = ['/', '*', '+', '-'];

    if (this.expression.length > 0 && operators.includes(lastChar) && operators.includes(value)) {
        this.expression = this.expression.slice(0, -1) + value;
    } else {
        this.expression += value;
    }

    const expressionText = this.expression.replace(/\//g, '÷');
    if (this.displayExpression) {
        this.displayExpression.textContent = expressionText;
    }
    this.updateDisplay();
}

  calculate(): void {
    try {
      this.result = eval(this.expression);
      this.addToHistory();
      this.expression = '';
      this.equalDisplayed = false;
      this.customButtonClicked = false;
      this.updateDisplay();
    } catch (error) {
      this.result = 'Error';
      this.updateDisplay();
    }
  }

  clear(): void {
    this.expression = '';
    this.result = '';
    this.equalDisplayed = false;
    this.customButtonClicked = false;
    this.updateDisplay();
  }

  updateDisplay(): void {
    if (this.result !== '') {
      if (!this.equalDisplayed) {
        if (this.displayResult) {
          this.displayResult.innerHTML = `= ${this.result}`;
        }
        this.equalDisplayed = true;
      } else {
        if (this.displayResult) {
          this.displayResult.textContent = `=                ${this.result}`;
        }
      }
      if (this.displayResult) {
        this.displayResult.style.paddingRight = '20px';
      }
    } else if (this.expression !== '') {
      const expressionText = this.expression.replace(/\//g, '÷').replace(/\*/g, 'x');
      if (this.displayExpression) {
        this.displayExpression.textContent = expressionText;
      }
    } else {
      if (this.displayResult) {
        this.displayResult.textContent = '';
      }
      if (this.displayExpression) {
        this.displayExpression.textContent = '';
      }
    }
  }

  addToHistory(): void {
    if (this.expression && this.result) {
      const historyItem = {
        expression: this.expression,
        result: this.result
      };

      this.history.push(historyItem);

      // En fazla 3 işlem sakla
      if (this.history.length > 3) {
        this.history.shift();
      }
    }
  }

  showHistory(): void {
    if (this.displayResult) {
      this.displayResult.textContent = ''; // Geçmiş işlemler butonuna tıklanınca sonuçları temizle
    }
    let historyText = '';
    this.history.forEach(item => {
      historyText += `${item.expression} = ${item.result}<br>`;
    });
    if (this.displayExpression) {
      this.displayExpression.innerHTML = historyText; // HTML içerik olarak ayarla
    }
  }

  toggleTheme(): void {
    const calculatorElement = document.querySelector('.calculator');
    if (calculatorElement) {
        calculatorElement.classList.toggle('dark');
        calculatorElement.classList.toggle('light'); // Eğer 'light' sınıfını da kullanmak istiyorsanız
    }
}
}
