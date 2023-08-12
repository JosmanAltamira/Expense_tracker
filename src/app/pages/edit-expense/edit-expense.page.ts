import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ExpenseService } from 'src/app/services/expense.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.page.html',
  styleUrls: ['./edit-expense.page.scss'],
})
export class EditExpensePage implements OnInit {
  form: FormGroup;
  id: number;

  constructor(
    private expenseService: ExpenseService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.id = +this.activatedRoute.snapshot.params.id;
  }

  async ngOnInit() {
    this.form = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });

    const loading = await this.loadingCtrl.create({
      message: 'Espere por favor...',
    });
    loading.present();

    this.expenseService.getById(this.id).subscribe({
      next: (expense) => {
        this.form.setValue({
          amount: expense.amount,
          description: expense.description,
        });
        this.form.updateValueAndValidity();
        loading.dismiss();
      },
    });
  }

  async onSubmit() {
    const loading = await this.loadingCtrl.create({
      message: 'Espere por favor...',
    });
    loading.present();

    this.expenseService.update(this.id, this.form.value).subscribe({
      next: () => {
        loading.dismiss();
        this.form.reset();
        this.router.navigateByUrl('/expenses');
        this.toastCtrl
          .create({
            message: 'Gastos actualizados con éxito',
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
