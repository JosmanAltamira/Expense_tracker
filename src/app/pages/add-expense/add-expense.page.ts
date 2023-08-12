import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { ExpenseService } from 'src/app/services/expense.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
})
export class AddExpensePage implements OnInit {
  form: FormGroup;

  constructor(
    private expenseService: ExpenseService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  async onSubmit() {
    const loading = await this.loadingCtrl.create({
      message: 'Espere por favor...',
    });
    loading.present();

    this.expenseService.add(this.form.value).subscribe({
      next: () => {
        loading.dismiss();
        this.form.reset();
        this.router.navigateByUrl('/home');
        this.toastCtrl
          .create({
            message: 'Gastos agregados con éxito',
            duration: 2000,
          })
          .then((toast) => toast.present());
      },
      error: () => {
        loading.dismiss();
      },
    });
  }
}
