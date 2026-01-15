import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ICONS } from '../../shared/icons';
import { GoodsService, AccountService } from '../../core/services';
import type { GoodsItem, Account } from '../../core/types';

@Component({
    selector: 'app-goofish-goods',
    imports: [LucideAngularModule],
    templateUrl: './goofish-goods.html',
    styleUrl: './goofish-goods.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoofishGoodsComponent implements OnInit {
    private readonly goodsService = inject(GoodsService);
    private readonly accountService = inject(AccountService);
    readonly icons = ICONS;

    private readonly STORAGE_KEY_ACCOUNT = 'goofish_goods_filter_account';
    private readonly STORAGE_KEY_STATUS = 'goofish_goods_filter_status';

    goods = signal<GoodsItem[]>([]);
    accounts = signal<Account[]>([]);
    selectedAccountId = signal<string>(localStorage.getItem(this.STORAGE_KEY_ACCOUNT) || '');
    selectedStatus = signal<string>(localStorage.getItem(this.STORAGE_KEY_STATUS) || '');
    loading = signal(false);
    totalCount = signal(0);

    filteredGoods = () => {
        const status = this.selectedStatus();
        if (status === '') {
            return this.goods();
        }
        return this.goods().filter(item => item.itemStatus === Number(status));
    };

    ngOnInit() {
        this.loadAccounts();
        this.loadGoods();
    }

    async loadAccounts() {
        try {
            const res = await this.accountService.getAccounts();
            this.accounts.set(res.accounts);
        } catch (e) {
            console.error('加载账号列表失败', e);
        }
    }

    async loadGoods() {
        this.loading.set(true);
        try {
            const accountId = this.selectedAccountId() || undefined;
            const res = await this.goodsService.getGoods(accountId);
            this.goods.set(res.items);
            this.totalCount.set(res.totalCount);
        } catch (e) {
            console.error('加载商品列表失败', e);
        } finally {
            this.loading.set(false);
        }
    }

    onAccountChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        this.selectedAccountId.set(select.value);
        localStorage.setItem(this.STORAGE_KEY_ACCOUNT, select.value);
        this.loadGoods();
    }

    onStatusChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        this.selectedStatus.set(select.value);
        localStorage.setItem(this.STORAGE_KEY_STATUS, select.value);
    }

    getStatusText(status: number): string {
        switch (status) {
            case 0: return '在售';
            case 1: return '已下架';
            default: return '未知';
        }
    }

    getStatusClass(status: number): string {
        switch (status) {
            case 0: return 'badge-success';
            case 1: return 'badge-warning';
            default: return 'badge-ghost';
        }
    }
}
