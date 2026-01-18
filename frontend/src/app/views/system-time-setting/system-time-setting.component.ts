import { Component, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { inject } from '@angular/core'
import { SettingsService } from '../../core/services/settings.service'
import { DialogService } from '../../shared/dialog/dialog.service'
import { LucideAngularModule } from 'lucide-angular'
import { ICONS } from '../../shared/icons'

@Component({
    selector: 'app-system-time-setting',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    template: `
        <div class="card bg-base-100 shadow-xl p-6">
            <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
                <lucide-icon [img]="icons.Clock" class="w-5 h-5"></lucide-icon>
                时间与时区设置
            </h2>
            
            <div class="space-y-6">
                <!-- 当前时间显示 -->
                <div class="card bg-base-200 p-4">
                    <h3 class="font-medium mb-3">当前时间</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <div class="text-xs opacity-70">UTC时间</div>
                            <div class="font-mono">{{ currentTime()?.utc_time }}</div>
                        </div>
                        <div>
                            <div class="text-xs opacity-70">本地时间</div>
                            <div class="font-mono">{{ currentTime()?.local_formatted }}</div>
                        </div>
                    </div>
                </div>
                
                <!-- 时区设置 -->
                <div class="card bg-base-200 p-4">
                    <h3 class="font-medium mb-3">时区设置</h3>
                    <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <select [(ngModel)]="selectedTimezone" class="select select-bordered flex-1">
                            <option value="Asia/Shanghai">亚洲/上海 (GMT+8)</option>
                            <option value="Asia/Tokyo">亚洲/东京 (GMT+9)</option>
                            <option value="Europe/London">欧洲/伦敦 (GMT+0)</option>
                            <option value="America/New_York">美洲/纽约 (GMT-5)</option>
                            <option value="America/Los_Angeles">美洲/洛杉矶 (GMT-8)</option>
                        </select>
                        <button class="btn btn-primary" (click)="saveTimezone()" [disabled]="saving()">
                            <lucide-icon [img]="icons.Save" class="w-4 h-4 mr-2" *ngIf="!saving()"></lucide-icon>
                            <span class="loading loading-spinner loading-xs mr-2" *ngIf="saving()"></span>
                            {{ saving() ? '保存中...' : '保存时区' }}
                        </button>
                    </div>
                    <div class="mt-2 text-sm opacity-70">
                        当前时区: {{ currentTime()?.timezone }}
                    </div>
                </div>
                
                <!-- 手动刷新时间 -->
                <div class="flex justify-end">
                    <button class="btn btn-outline" (click)="refreshTime()" [disabled]="loading()">
                        <lucide-icon [img]="icons.RefreshCw" class="w-4 h-4 mr-2"></lucide-icon>
                        刷新时间
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host {
            display: block;
            padding: 1rem;
        }
    `]
})
export class SystemTimeSettingComponent implements OnInit {
    readonly settingsService = inject(SettingsService)
    readonly dialog = inject(DialogService)
    readonly icons = ICONS
    
    currentTime = signal<any>(null)
    selectedTimezone = signal<string>('Asia/Shanghai')
    loading = signal<boolean>(false)
    saving = signal<boolean>(false)
    
    ngOnInit() {
        this.loadTimeInfo()
    }
    
    async loadTimeInfo() {
        this.loading.set(true)
        try {
            const response = await this.settingsService.getTimeInfo()
            this.currentTime.set(response)
            this.selectedTimezone.set(response.timezone || 'Asia/Shanghai')
        } catch (error) {
            console.error('加载时间信息失败:', error)
            this.dialog.showError('加载时间信息失败')
        } finally {
            this.loading.set(false)
        }
    }
    
    async saveTimezone() {
        this.saving.set(true)
        try {
            await this.settingsService.setTimezone(this.selectedTimezone())
            this.dialog.showSuccess('时区设置已保存')
            // 重新加载时间信息
            await this.loadTimeInfo()
        } catch (error) {
            console.error('保存时区失败:', error)
            this.dialog.showError('保存时区失败')
        } finally {
            this.saving.set(false)
        }
    }
    
    async refreshTime() {
        await this.loadTimeInfo()
    }
}