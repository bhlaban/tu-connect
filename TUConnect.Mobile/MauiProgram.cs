using Microsoft.Extensions.Logging;
using TUConnect.Mobile.Services;
using TUConnect.Mobile.ViewModels;
using TUConnect.Mobile.Views;

namespace TUConnect.Mobile;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        // Register services
        builder.Services.AddSingleton<IApiService, ApiService>();

        // Register ViewModels
        builder.Services.AddTransient<MainViewModel>();
        builder.Services.AddTransient<VolunteerTimeViewModel>();
        builder.Services.AddTransient<FishingLogViewModel>();
        builder.Services.AddTransient<MemberViewModel>();

        // Register Views
        builder.Services.AddTransient<MainPage>();
        builder.Services.AddTransient<VolunteerTimePage>();
        builder.Services.AddTransient<FishingLogPage>();
        builder.Services.AddTransient<MembersPage>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
